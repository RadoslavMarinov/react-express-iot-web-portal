Session {
  status:"last response status",
  session:"session",
  user: {
    devices: [],
    password: "******",
    username: "******",
    _id: "5bef12d0e7179a56e211afc1"
  }
}

// "/api/login/data":
{
  request: {
    username: "this.state.username",
    password: "this.state.password"
  }
  
  response : { status: 'OK',
    session: { expTime: 1542683001.663 },
     user:
      { _id: "5bef12d0e7179a56e211afc1",
        username: 'admin',
        password: 'admin',
        devices: [ [Object] ] 
      }
  }
}

post("/api/user/get-data")
{
  request:{
    userId: session.userId
  },
  response:{

  } 

}


