class Server {
    user = null;
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
    
    async createPost(title,text,code,userId) {
        return await this.send('createPost',{ title, text, code, userId });
    }
}