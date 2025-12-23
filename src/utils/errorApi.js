class ErrorApi extends Error {
    constructor(statuscode , message= 'Something went wrong' , errors = [] , stacks = ""){
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.success = false;
        this.data = false;

        if(stacks){
            this.stack = stacks;
        }else{
            Error.captureStackTrace(this , this.constructor);
        }
    }
}

export default ErrorApi;