(adsbygoogle = window.adsbygoogle || []).push({})
var app = angular.module("App", ['ngCookies'])

app.controller('AppCtrl', function($scope, $http, $cookies){
  (function(){
    new Clipboard('#invlinkbtn');
  })();
  $scope.updateTeams = function(){
    $http.get('/model/get/teams').then(function(data){
      $scope.Teams = data.data;
      console.log(data)
    })
  }

  $scope.updateTeams()
  $http.post('/user/this').then(function(res){
    if(res.data == false){
      $scope.hideLogin = false;
      $scope.hasTeam = false;
    } else {
      $scope.hideLogin = true;
      $scope.profile = res.data
      if(res.data.Team != ""){
        $scope.hasTeam = true;
        $scope.getTeam(res.data.Team).then(function(data){
            if(data.Leader == $scope.profile.SteamID){
              $scope.leader = true;
            }
        })
      } else {
        $scope.hasTeam = false;
        $scope.LoggedInNoTeam = true;
      }
    }
  })

  $scope.getTeam = async function(name, cb){
    let response = await $http({
      method: 'POST',
      url: '/model/get/team',
      data: { Name: name },
    })
      $scope.team = response.data;
      $scope.invlink = "http://localhost/invite/" + $scope.team.Name + "/" + $scope.team.INV_TOKEN;
      return response.data;
  }

  $scope.createTeam = function(){
    if($scope.ctname.match(/\s|\./g)){
      alert("Teamname cannot include whitespaces!")
    } else {
    $http({
      method: 'POST',
      url: '/model/create/team',
      data: { Name: $scope.ctname , Leader: $scope.profile.SteamID}
    }).then(function(response){
      if(response.data == false){
        console.log("Already in a Team!")
      }
    })
    $scope.updateTeam($scope.ctname)
    $scope.updateTeams()
    $scope.getTeam($scope.profile.Team)
    $scope.hasTeam = true;
    $scope.LoggedInNoTeam = false;
    location.reload()
  }
  }
$scope.kick = function(id){
  $http({
    method: 'POST',
    url: '/model/remove/team/player',
    data: { Team: $scope.profile.Team, Name: id}
  })
  $scope.getTeam($scope.profile.Team);
  location.reload()
}
  $scope.updateTeam = function(name){
    $http({
      method: 'POST',
      url: '/model/update/user/team',
      data: { Team: name}
    })
  }
})
