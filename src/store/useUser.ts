import { defineStore } from "pinia";
import { get } from "../lib/http";
import { Extract200JSON } from "../lib/openapi";


interface State {
    allUserList: Extract200JSON<"get", '/api/User/Get'>["response"]["data"]
}

const useUser = defineStore("useUser", {
    state:() :State => ({
        allUserList:[]
    }),
    actions:{
        async getAllUser(){
            const res = await get("/api/User/Get");
            this.allUserList = res.data.response.data
            return res.data.response;
        }
    }
})
export default useUser