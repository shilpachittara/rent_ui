export const getRate = (timeScaleLocal, rateLocal) => {
  switch (timeScaleLocal) {
    case 1:
      //minutes
      return rateLocal / 60;
    case 2:
      //hours
      return rateLocal / 3600;
    case 3:
      //days
      return rateLocal / 86400;
    case 4:
      //weeks
      return rateLocal / 604800;
    case 5:
      //months
      return rateLocal / 2592000;
    case 6:
      //years
      return rateLocal / 31536000;
    default:
      return rateLocal;
  }
};

export const getSeconds = (timeScaleLocal, rateLocal) => {
    switch (timeScaleLocal) {
      case 1:
        //minutes
        return rateLocal * 60;
      case 2:
        //hours
        return rateLocal * 3600;
      case 3:
        //days
        return rateLocal * 86400;
      case 4:
        //weeks
        return rateLocal * 604800;
      case 5:
        //months
        return rateLocal * 2592000;
      case 6:
        //years
        return rateLocal * 31536000;
      default:
        return rateLocal;
    }
  };