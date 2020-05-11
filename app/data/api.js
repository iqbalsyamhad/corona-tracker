import RNFetchBlob from 'react-native-fetch-blob';

const Apimanager = {

    call: (url, collection) => {
        const endpoint = "http://coronavirus-tracker-api.herokuapp.com/v2/";

        return new Promise(function (resolve, reject) {
            RNFetchBlob
            // .config({
            //     trusty: true
            // })
            .fetch('GET', endpoint + url + collection, {
                'Content-Type': 'application/json'
            })
            .then((res) => {
                if (res.respInfo.status == 200) resolve(res);
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