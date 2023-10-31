class User{
    constructor(nom,prenoms,email,password,avatar=null){
       this.nom=nom
       this.prenoms=prenoms
       this.email=email
       this.password=password
       this.avatar=avatar
    }
}


module.exports=User