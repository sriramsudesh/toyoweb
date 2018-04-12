var debug = require('debug')('loopback:init-access')

module.exports = function (app) {
  var Auth = app.models.Auth
  var Role = app.models.Role
  var RoleMapping = app.models.RoleMapping

  var seedUsers = [
      {username: 'watson', email: 'watson@ibm.com', password: 'p@ssw0rd'},
      {username: 'ibm', email: 'ibm@ibm.com', password: 'watson'},
      {username: 'admin', email: 'admin@ibm.com', password: '@dm1n'}]

  var seedRoles = [{name: 'admin'}]

  seedUsers.forEach(function (seedUser) {
    try {
      debug('Checking if user ' + seedUser.username + ' exist.')
      Auth.findOne(
        {where: {username: seedUser.username}},
        function (err, user) {
          debug('Response from Auth.findOne....' + user)
          if (user) {
            debug('User ' + user.username + ' already created.')
            checkRole()
          }
          if (err || !user) {
            Auth.create(seedUser, function (err, user) {
              debug('Return from Auth.create: ' + JSON.stringify(user))
              if (err) {
                debug('ERROR CREATING SEED USERS: ' + err)
              } else {
                debug('User created: ' + user.username)
                checkRole()
              }
            })
          }
        })
    } catch (err) {
      debug(err)
    }
  })

  function checkRole () {
    seedRoles.forEach(function (seedRole) {
      try {
        Role.findOne({where: {name: seedRole.name}}, function (err, role) {
          if (err) {
            throw err
          }
          if (role) {
            debug('Role ' + role.name + ' already exist')
            role.principals.count(function (err, count) {
              if (err) {
                throw err
              }
              debug('the role has ' + count + ' principals')
            })
          } else {
            Role.create(seedRole, function (err, role) {
              if (err) {
                throw err
              }
              role.principals.create({
                principalType: RoleMapping.USER, principalId: seedUsers[1].id},
              function (err, principal) {
                if (err) throw err
                debug('Created principal:', principal)
              })
            })
          }
        })
      } catch (err) {
        debug(err)
      }
    })
  }
}
