import axios from 'axios';
import config from '../config/appsetting';

let GetApis = async (controller, action, params, timeout) => {
    try {
        let res = await axios.get(`${config.APIHOST}/api/${controller}/${action}`, {
            timeout: timeout,
            headers: {
                'cache-control': 'no-cache',
                'Authorization': config.Authorization,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            params: params
        });
        let data = await res.data;
        if (data == undefined) {
            return 'error';
        }
        else{
            return data;
        }
    } catch (error) {
        return 'error'
    }
}

let PostApis = async (controller, action, params, timeout) => {
    try {
        let res = await axios({
            url: `${config.APIHOST}/api/${controller}/${action}`,
            method: 'POST',
            timeout: timeout,
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
                'Authorization': config.Authorization,
                'Access-Control-Allow-Origin': '*',
            },
            data: JSON.stringify(params)
        });
        let data = await res.data;
        if (data == undefined) {
            return "error get";
        }
        else
            return data;
    } catch (error) {
        return error
    }
};

export { GetApis, PostApis };