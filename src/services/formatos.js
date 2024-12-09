/* eslint-disable no-unused-vars */
import dayjs from "dayjs";
function formatearFecha(fecha){
    const formattedDate = dayjs(fecha).format("DD/MM/YYYY");
    return formattedDate;
}

export default formatearFecha;
/* eslint-disable no-unused-vars */