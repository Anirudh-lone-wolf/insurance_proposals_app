// utility function  to generate local formatted timestamp
const getTimestamp = () => {

    // Create new date object using system local time
    const now = Date();

    // Convert date into readable date format
    return now.toLocaleString('en-In', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

};

// INFO LOG
export const info = (message, data = null) => {
    console.log(`[${getTimestamp()}] [INFO] ${message}`);
    if(data) console.log(data);
    console.log('-------------------------------------');
};

// ERROR LOG
export const error = (message, error=null) => {
    console.log(`[${getTimestamp()}] [ERROR] ${message}`);
    // print actual error object if provided
    if(error) console.error(error);
    console.log('-------------------------------------');
};

// SUCCESS LOG
export const success = (message, data = null) => {
    console.log(`[${getTimestamp()}] [SUCCESS] ${message}`);
    if(data) {
        console.log(data);
    }
    console.log('-------------------------------------');
};
