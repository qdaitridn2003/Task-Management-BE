import Bcrypt from 'bcrypt';

const hashHandler = {
    init: (value: string | Buffer) => {
        const saltRound = Bcrypt.genSaltSync(0);
        const hash = Bcrypt.hashSync(value, saltRound);
        return hash;
    },
    compare: (value: string, hashedValue: string) => {
        const comparedResult = Bcrypt.compareSync(value, hashedValue);
        return comparedResult;
    },
};

export default hashHandler;
