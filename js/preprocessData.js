// Takes data and converts it into required types
function preprocessData(data) {


    data.forEach(d => {

        // Convert columns to numerical values
        Object.keys(d).forEach((attr => {
            if (attr != 'Name' && attr != 'Platform' && attr != 'Genre' && attr != 'Publisher'
                && attr != 'Developer' && attr != 'Rating') {
                d[attr] = +d[attr];
            }
        }))

        // Map each rating to a numerical value
        switch (d['Rating']) {
            case 'E':
                d['Rating-Value'] = 0;
                break;
            case 'E10+':
                d['Rating-Value'] = 1;
                break;
            case 'T':
                d['Rating-Value'] = 2;
                break;
            default:
                d['Rating-Value'] = 3;
                break;
        }
    });

    // TODO STUB

    return data;
}