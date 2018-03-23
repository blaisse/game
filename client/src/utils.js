module.exports = {
    dateHMS: function(completed){
        let minutes = new Date(completed).getMinutes();
        const seconds = new Date(completed).getSeconds();
        // const hours = new Date(completed).getHours();
        const d = `${new Date(completed).getHours()}:${(minutes < 10 ? '0' : '')}${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
        return d;
    },
    timeBuild: function(time){
        const appendZero = (mili) => {
            if(mili < 10){
                return mili = `0${mili}`;
            }
            return mili;
        }
        let hours = Math.floor(time / (1000*60*60)%60);
        let minutes = Math.floor(time / (1000*60)%60);
        let seconds = Math.floor(time / 1000%60);
        return `${appendZero(hours)}:${appendZero(minutes)}:${appendZero(seconds)}`;
    }
};