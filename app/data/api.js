import RNFetchBlob from 'react-native-fetch-blob';

const Apimanager = {

    call: (url, collection) => {
        const endpoint = "https://covid19.mathdro.id/api/";

        return new Promise(function (resolve, reject) {
            RNFetchBlob
            .config({
                trusty: true
            })
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

    getData: async (param) => {
        let result = {};
        await Apimanager.call(param, "")
            .then((response) => {
                result = {
                    value: response.json(),
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

    getAllCountry: async () => {
        let result = {};
        await Apimanager.call("countries", "")
            .then((response) => {
                result = {
                    value: response.json(),
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