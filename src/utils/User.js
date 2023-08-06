

export default class User {
    constructor(f_name, l_name, username, email, password){
        this.f_name = f_name
        this.l_name = l_name
        this.username = username
        this.email = email
        this.password = password
    }

    saveLocal(){
        localStorage.setItem("USER", JSON.stringify({f_name : this.f_name, l_name : this.l_name, username : this.username, email : this.email}))
    }
}