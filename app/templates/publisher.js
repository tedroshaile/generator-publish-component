"use strict"

const q = require('q')
    , _ = require('lodash')
    , moment = require('moment')
    , tz = require('moment-timezone')
    , camelCaseKeys = require('camelcase-keys')
    , log = require('../publish-logger')

var publishImpl = function *(oraConnection, mongoConnection) {
    var deletedCount = 0
        , updatedCount = 0

    const baseSql = 'select * from publishview<%=publisherComponentNamePlural%>'

    let qOraExecute = q.nbind(oraConnection.execute, oraConnection)
    yield log.logAction(mongoConnection,'<%=publisherName%>','started')

    var lastCompleted = yield log.getLastCompleted(mongoConnection, '<%=publisherName%>')

    //todo: convert to oracle timestamp format
    console.log('last success: '+lastCompleted)
///////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// Queries
//////////////////////////////////////////////////////////////////////////////////////////

    var updatedSql = baseSql + ' where update_date < :1 and delete_flag = :2' // updated or created since last run
    var deletedSql = baseSql + ' where update_date < :1 and delete_flag = :2' // updated since last run with deleted flag

    let updatedQueryResults = yield qOraExecute(updatedSql, [lastCompleted, false])
        , deletedQueryResults = yield qOraExecute(deletedSql, [lastCompleted, true])


///////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// Updates
//////////////////////////////////////////////////////////////////////////////////////////

    var updatedJson = _.map(updatedQueryResults, function (aRec) {
        //Add custom mapping for nested objects

        // Format Date Meta Data
        aRec.createDate = moment(aRec.CREATE_DATE).format('YYYY-MM-D')
        aRec.updateDate = moment(aRec.UPDATE_DATE).format('YYYY-MM-D')
        return camelCaseKeys(aRec)
    })

    _.forEach(updatedJson, function (upd, index){
        mongoConnection.collection('<%=publisherComponentNamePlural%>', function(err, collection) {
            collection.update({'<%=publisherComponentKey%>': upd["<%=publisherComponentKey%>"]}, updatedJson[index], {upsert:true, w: 1}, function(err, numberOfUpdatedDocs) {
                updatedCount += numberOfUpdatedDocs
            });
        });
    })
///////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// Deletes
///////////////////////////////////////////////////////////////////////////////////////////
    var deletedJson = _.map(deletedQueryResults, function (aRec) {
        return {'<%=publisherComponentKey%>':aRec['<%=publisherComponentKey%>']}
    })

    _.forEach(deletedJson, function (del, index){
        mongoConnection.collection('<%=publisherComponentNamePlural%>', function(err, collection) {
            collection.remove(del[index], {w: 1}, function(err, numberOfDeletedDocs) {
                deletedCount += numberOfDeletedDocs
            });
        });
    })

    yield log.logAction(mongoConnection,'<%=publisherName%>','finished', {updated: updatedCount, deleted: deletedCount})

    return "'<%=publisherName%>' completed"
}

module.exports = {
    publish:publishImpl
}