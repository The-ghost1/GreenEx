export const closeModal = () => {
	window["$"]('.modal-backdrop').removeClass("show");
	window["$"]('.modal-backdrop').addClass("hide");
	window["$"]('#userModal').removeClass("show");
	window["$"]('#userModal').addClass("hide");
}

export const connected = ()=> {
	return window.localStorage.getItem("token") != null;
}

export const getCurrentUser = () => {
 	return JSON.parse(window.localStorage.getItem("user"));
}

// export const formatDate = (date) => {
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2) 
//         month = '0' + month;
//     if (day.length < 2) 
//         day = '0' + day;

//     return [day, month, year].join('-');
// }