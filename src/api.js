const BASE_URL = 'https://dolar.melizeche.com/api/1.0';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const randomNumber = (min = 0, max = 1) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
const simulateNetworkLatency = (min = 30, max = 1500) =>
    delay(randomNumber(min, max));

async function callApi(endpoint, options = {}) {
    await simulateNetworkLatency();

    options.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    const url = BASE_URL + endpoint;
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data)
    return data;
}

const api = {
    dolarpy: {
        list() {
            return callApi('/');
        },
        create(dolarpy) {
            return callApi(`/dolarpy`, {
                method: 'POST',
                body: JSON.stringify(dolarpy),
            });
        },
        read(badgeId) {
            return callApi(`/dolarpy/${badgeId}`);
        },
        update(badgeId, updates) {
            return callApi(`/dolarpy/${badgeId}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
        },
        // Lo hubiera llamado `delete`, pero `delete` es un keyword en JavaScript asi que no es buena idea :P
        remove(badgeId) {
            return callApi(`/dolarpy/${badgeId}`, {
                method: 'DELETE',
            });
        },
    },
};

export default api;
