angular.module('app.input', [
  'ngMaterial',
  'ngMessages'
])
.controller('inputController', function($scope, $http, $location, $route, Upload, News, Companies, Jobs) {

  $scope.job = {
    company: undefined,
    salary: undefined,
    dateCreated: new Date(),
    position: undefined,
    contacts: [{name: undefined,
              phoneNumber: undefined,
              email: undefined,
              handle: undefined}],
    link: undefined,
    website: undefined,
    description: undefined,
    imageUrl: undefined,
    officialName: undefined,
    approxEmployees: undefined,
    founded: undefined,
    address: undefined,
    currentStep: {name: undefined,
              comments:[],
              dueDate: null},
    nextStep: {name: undefined,
              comments:[],
              dueDate: null}
  };

  $scope.$watch('file', function() {
    var file = $scope.file;
    if (!file) {
      return;
    }
    Upload.upload({
      url: 'api/upload',
      file: file
    })
    // .progress(function(evt) {
    //   var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //   console.log('progress: ' + progressPercentage + '%' + evt.config.file.name);
    // }).success(function(data, status, headers, config) {
    //   console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
    // }).error(function(data, status, headers, config) {
    //   console.log('error status: ' + status);
    // })
    .then(function(res) {
      console.log('response!', res);
    })
  });

  $scope.addContact = () => {
    $scope.job.contacts.push({name: undefined,
              phoneNumber: undefined,
              email: undefined})
  }

  $scope.submitJob = function(data){
    console.log($scope.job);

    if($scope.job.nextStep.name === undefined) {
      $scope.job.nextStep = null;
    }

    if($scope.job.contacts[0].name === undefined) {
      $scope.job.contacts = [];
    }
    //
    // if ($scope.job.website.slice(0, 7) !== 'http://'
    //   && $scope.job.website.slice(0, 8) !== 'http://') {
    //   $scope.job.website = `http://${$scope.job.website}`;
    // }

    Companies.getInfo($scope.job.website)
    .then((data)=> {
      if(data === undefined) return;
      console.log(data);

      $scope.job.imageUrl = data.logo;
      $scope.job.description = data.organization.overview;
      $scope.job.officialName = data.organization.name;
      $scope.job.approxEmployees = data.organization.approxEmployees;
      $scope.job.founded = data.organization.founded;

      var addr = data.organization.contactInfo.addresses[0];

      if(addr.code) {
      $scope.job.address = addr.addressLine1 + ", "
        + addr.locality + ", "
        + addr.region.code + ", "
        + addr.postalCode + ", "
        + addr.country.code;
      }
      Jobs.create($scope.job)
        .then((res) => {
        alert(res);
        $location.url('/dashboard');
      });
    })
    .catch((err) => {
      $route.reload();
    });
  };

});
