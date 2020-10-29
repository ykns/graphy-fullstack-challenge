// from https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
export function makeCancelable<T>(promise: Promise<T>) {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise<T>(async (resolve, reject) => {
        try {
            const result = await promise;
            if (hasCanceled_) {
                reject({ isCanceled: true });
            } else {
                resolve(result);
            }
        } catch (error) {
            if (hasCanceled_) {
                reject({ isCanceled: true });
            } else {
                resolve(error);
            }
        }
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
        isCanceled: hasCanceled_
    };
};