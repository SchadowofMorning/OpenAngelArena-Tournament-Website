var app = angular.module("App", ['ngCookies'])

app.controller('AppCtrl', function($scope, $http, $cookies){
  (function(){
    new Clipboard('#invlinkbtn');
  })();
  $scope.updateTeams = function(){
    $http.get('/model/get/teams').then(function(data){
      $scope.Teams = data.data;
    })
  }

  $scope.updateTeams()
  $http.post('/user/this').then(function(res){
    console.log(res.data)
    if(res.data == false){
      $scope.hideLogin = false;
      $scope.hasTeam = false;
    } else {
      $scope.hideLogin = true;
      $scope.profile = res.data
      if(res.data.Team != ""){
        $scope.hasTeam = true;
        $scope.getTeam(res.data.Team)
        if(res.data.Team.Leader == $scope.profile.SteamID){
          $scope.leader = true;
        }
      } else {
        $scope.hasTeam = false;
        $scope.LoggedInNoTeam = true;
      }
    }
  })

  $scope.getTeam = function(name){
    $http({
      method: 'POST',
      url: '/model/get/team',
      data: { Name: name },
    }).then(function(response){
      $scope.team = response.data;
      $scope.invlink = "http://localhost/invite/" + $scope.team.Name + "/" + $scope.team.INV_TOKEN;
    })
  }

  $scope.createTeam = function(){
    if($scope.ctname.match(/\s|\./g)){
      alert("Teamname cannot include whitespaces!")
    } else {
    $http({
      method: 'POST',
      url: '/model/create/team',
      data: { Name: $scope.ctname , Leader: $scope.profile.SteamID, Players: $scope.profile.SteamID}
    }).then(function(response){
      if(response.data == false){
        console.log("Already in a Team!")
      }
    })
    $scope.updateTeam($scope.ctname)
    $scope.updateTeams()
    $scope.getTeam()
    $scope.hasTeam = true;
    $scope.LoggedInNoTeam = false;
  }
  }

  $scope.updateTeam = function(name){
    $http({
      method: 'POST',
      url: '/model/update/user/team',
      data: { Team: name}
    })
  }
})
