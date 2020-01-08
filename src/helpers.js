import stateList from './states';

export function getStateNameByStateCode(code) {
    for (let key in stateList) {
        if (code === key) {
            return stateList[key]
        }
      }
}
