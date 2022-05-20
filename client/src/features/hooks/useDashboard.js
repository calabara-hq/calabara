import { useSelector, useDispatch } from 'react-redux';
import { selectDashboardInfo, populateInfo } from '../dashboard/dashboard-info-reducer';
export default function useDashboard() {

    const info = useSelector(selectDashboardInfo)
    const dispatch = useDispatch();

    const updateDashboardInfo = (params) => {

        let infoCopy = JSON.parse(JSON.stringify(info));

        infoCopy = Object.assign(infoCopy, params)
        dispatch(populateInfo(infoCopy))
    }

    return {
        updateDashboardInfo: (params) => {
            updateDashboardInfo(params)
        },
    }

}