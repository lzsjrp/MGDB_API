export default {
    language: (value: any) => {
        if (value == null || typeof value !== 'string') {
            return false;
        }
        const regex = /^[a-z]{2}-[A-Z]{2}$/;
        return regex.test(value);
    },
    password: (value: any) => {
        if (value == null || typeof value !== 'string') {
            return false;
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return regex.test(value);
    },
    email: (value: any) => {
        if (value == null || typeof value !== 'string') {
            return false;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }
}