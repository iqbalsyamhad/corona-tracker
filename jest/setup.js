import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const fs = require('fs')

jest.mock('react-native-fetch-blob', () => {
    return {
        DocumentDir: () => { },
        fetch: () => new Promise((resolve, reject) => {
            fs.readFile('./__tests__/__mocks__/ID.json', 'utf8', (err, data) => {
                if (err) reject(err)
                resolve(JSON.parse(data))
            })
        }),
        base64: () => { },
        android: () => { },
        ios: () => { },
        config: () => { },
        session: () => { },
        fs: {
            dirs: {
                MainBundleDir: () => { },
                CacheDir: () => { },
                DocumentDir: () => { },
            },
        },
        wrap: () => { },
        polyfill: () => { },
        JSONStream: () => { }
    }
})