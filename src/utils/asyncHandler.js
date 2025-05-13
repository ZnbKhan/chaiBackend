
const asyncHandler = (fn)=> async(req,res,next)=> {
    try {

        await fn(req,res,next)
        
    } catch (error) {
        res.status(error.code || 500).json({
            success:false,
            message:error.message
        })
    }
}    

export {asyncHandler};


// const asyncHandler = ()=>{}
// const asyncHandler = (func)=>{  ()=> {} }
// const asyncHandler = (func) => ()=> {}


// promises ki help se bhi bna skte hai
// const asyncHandler = (requesthandler)=>{
//    return (req,res,next)=>{
//     Promise
//         .resolve(requesthandler(req,res,next))
//         .catch( (err) => next(err))
//    };

// };
