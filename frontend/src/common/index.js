const backendDomain="http://localhost:8080"

const SummaryApi={
    signup :{
        url: `${backendDomain}/api/v1/user/register`
    },
    logout:{
        url: `${backendDomain}/api/v1/user/logout`
    },
    handler:{
        url:`${backendDomain}/api/v1/post`
    },
    deletePost:{
        url:`${backendDomain}/api/v1/post/delete`
    },
    login:{
        url:`${backendDomain}/api/v1/user/login`
    },
    editProfile:{
        url:`${backendDomain}/api/v1/user/profile/edit`
    },
    addPost:{
        url:`${backendDomain}/api/v1/post/addpost`
    },
    sendMessage:{
        url:`${backendDomain}/api/v1/message/send`
    },
    allMessage:{
        url:`${backendDomain}/api/v1/message/all`
    },
    userhandler:{
        url:`${backendDomain}/api/v1/user`
    },
    domain:{
        url:`${backendDomain}`
    }
}


export default SummaryApi;