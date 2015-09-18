angular.module('company')

    .controller('companyDetailsController', function($scope, $state, company, companyRestService) {

        var _backToList = function() { $state.go('^.list'); };

        $scope.company = company;
        $scope.isEditing = company && company.id;
        $scope.companyImageNgfValidate = {size: {max: '10MB', min: '10B'}};

        $scope.delete = function() {
            companyRestService.delete($scope.company)
                .then(_backToList);
        };

        $scope.createOrUpdate = function() {
            var image = $scope.image.$error ? null : $scope.image;
            companyRestService.createOrUpdate($scope.company, image, $scope.isEditing)
                .then(_backToList);
        };

    });
