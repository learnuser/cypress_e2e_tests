
let accessToken;

export function getAccessToken(userName, password, status=200){
    let options = {
        method: "POST",
        failOnStatusCode: false,
        url: "/api/v1/login/access-token",
        form: true,
        body: {
              username: userName,
              password: password
              }
        }
    return cy.request(options).then((res)=>{
        expect(res.status).to.eq(status)
        if (status===200){
            expect(res.body).to.have.property('access_token')
        } else if (status===400){
            expect(res.body.detail).to.eq("Incorrect email or password")
        } else if (status===422){
            expect(res.body.detail[0].msg).to.eq("field required")
        }
        return res
    })
}

export function getCurrentUserData(accessToken, status=200){
    let userOptions = {url:'/api/v1/users/me', failOnStatusCode: false, auth: {bearer: accessToken}}
    return cy.request(userOptions).then((res)=>{
        expect(res.status).to.eq(status)
        if (status===200){
            expect(res.body).to.have.keys('email','id','is_active','is_superuser','full_name')
        } else {
            expect(res.body.detail).to.eq("Could not validate credentials")
        }
        return res.body
     })
}

export function getAllUsersData(accessToken, status=200){
    let userOptions = {url:'/api/v1/users', failOnStatusCode: false, auth: {bearer: accessToken}}
    return cy.request(userOptions).then((res)=>{
        expect(res.status).to.eq(status)
        if (status===200){
            expect(res.body.length).to.be.greaterThan(0)
            expect(res.body[0]).to.have.keys('email','id','is_active','is_superuser','full_name')
        } else {
            expect(res.body.detail).to.eq("Could not validate credentials")
        }
        return res.body
     })
}

export function updateCurrentUser(accessToken, body, status=200){
    let updateUserOptions = {method:'PUT', failOnStatusCode: false, url:'/api/v1/users/me',
                             body: body, auth: {bearer: accessToken}}
    cy.request(updateUserOptions).then((res)=>{
        expect(res.status).to.eq(status)
        if (status===200){
            //pass
        } else {
            expect(res.body.detail).to.eq("Could not validate credentials")
        }
    })
}

export function updateUserById(accessToken, id, body, status=200){
    let updateUserOptions = {method:'PUT', failOnStatusCode: false, url:'/api/v1/users/' + id,
                             body: body, auth: {bearer: accessToken}}
    cy.request(updateUserOptions).then((res)=>{
        expect(res.status).to.eq(status)
        if (status===200){
            expect(res.body).to.have.keys('email','id','is_active','is_superuser','full_name')
        } else if (status===403) {
            expect(res.body.detail).to.eq("Could not validate credentials")
        } else if (status===400) {
            expect(res.body.detail).to.eq("The user doesn't have enough privileges")
        }
    })
}

export function getUserDataById(accessToken, id, status=200){
    let userOptions = {url:'/api/v1/users/'+id, failOnStatusCode: false, auth: {bearer: accessToken}}
    return cy.request(userOptions).then((res)=>{
        expect(res.status).to.eq(status)
        if (status===200){
            expect(res.body).to.have.keys('email','id','is_active','is_superuser','full_name')
        } else {
            expect(res.body.detail).to.eq("Could not validate credentials")
        }
        return res.body
     })
}

export function createUser(accessToken, status=200){
    let createUserBody = {"full_name":"apiUser1","email":"apiUser2@tqqaproject.com","is_active":true,
                           "is_superuser":false,"password":"test2"}
    let createUserOptions = {method:'POST', failOnStatusCode: false, url: '/api/v1/users',
                             body: createUserBody, auth: {bearer: accessToken}}
    cy.request(createUserOptions).then((res)=>{
        expect(res.status).to.eq(status)
        if (status===200){
            expect(res.body).to.have.keys('email','id','is_active','is_superuser','full_name')
        } else if (status===403) {
            expect(res.body.detail).to.eq("Could not validate credentials")
        } else if (status===400) {
            expect(res.body.detail).to.satisfy((err)=>{
                if (err === "The user with this username already exists in the system."
                    || err === "The user doesn't have enough privileges") {
                    return true
                } else {
                    return false
                }
            })
        }
    })
}