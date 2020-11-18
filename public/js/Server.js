class Server {

    token = null;
    userPermissions = null;
    async send(method, data) {
        const arr = [];
        for (let key in data) {
            arr.push(`${key}=${data[key]}`);
        }
        const response = await fetch(`api/?method=${method}&${arr.join('&')}`);
        const answer = await response.json();
        if (answer && answer.result === 'ok') {
            return answer.data;
        } else if(answer && answer.result === 'error') {
            return false;
        }
    }

    async getPostById(postId) {
        return await this.send('getPostById',{ postId });
    }

    async getLastPosts(postId, postCount) {
        return await this.send('getLastPosts',{ postId, postCount});
    }
    async getLastPostId() {
        return await this.send('getLastPostId',{});
    }
    
    async createPost(title,text) {
        if(this.userPermissions && this.token && this.userPermissions.allowCreatePost) {
            var token = this.token;
            return await this.send('createPost',{ title, text, token });
        } else {
            return false;
        }
        
    }

    async auth(login, password) {
        const data = await this.send('login', { login, password });
        if (data && data.token) {
            this.token = data.token;
            this.userPermissions = await this.getUserPermissionsByToken(this.token);
            console.log(this.token);
            console.log(this.userPermissions);
        }
        return data;
    }
    async getUserPermissionsByToken(token) {
        return await this.send('getUserPermissionsByToken', { token });
    }
    async getUserByPostId(id) {
        return await this.send('getUserByPostId', { id });
    }
    logout() {
        var token = this.token;
        this.userPermissions = null;
        return this.send('logout', { token });
    }
    registration(login, password) {
        return this.send('registration', { login, password });
    }
}