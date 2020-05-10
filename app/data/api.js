const Apimanager = {

    call: (url, collection) => {
        const endpoint = "http://coronavirus-tracker-api.herokuapp.com/v2/";

        return new Promise(function(resolve, reject) {
            fetch(endpoint+url+collection, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if(res.status == 200) resolve(res.json());
                else reject('Failed to get data from API.');
            })
            .catch((error) => {
                reject(error);
            })
            .done()
        });
    },

    getLocations: async (collection) => {
        let result = {};
        await Apimanager.call("locations?", Apimanager.objToQuery(collection))
        .then((response) => {
            result = {
                value: response,
                status: 'success'
            }
        })
        .catch(error => {
            result = {
                value: error.message,
                status: 'failed'
            }
        });
        return result;
    },

    objToQuery: (collection) => {
        const keyValuePairs = [];
        for (const key in collection) {
            keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(collection[key]));
        }
        return keyValuePairs.join('&');
    }
}

export default Apimanager;