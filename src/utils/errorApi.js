class ErrorApi extends Error {
    constructor(statuscode , message= 'Something went wrong' , errors = [] , statck = ""){
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.success = false;
        this.data = false;

        if(statck){
            this.stack = statck;
        }else{
            Error.captureStackTrace(this , this.constructor);
        }
    }
}

export default ErrorApi;