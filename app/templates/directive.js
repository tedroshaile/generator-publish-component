angular.module('<%=angularModuleName%>').directive('<%=directiveName%>', function () {
    return {
        restrict: 'E'
        , transclude: true
        , replace: true
        , scope: true
        , controller: '<%=controllerName%>'
        , templateUrl: '/<%=angularComponentName%>/<%=templateFileName%>'
    };
})