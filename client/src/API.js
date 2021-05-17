async function getAllTasks() {
    return fetch('/api/tasks/all')
            .then((response) => {
                if(response.ok) {
                    //let type = response.headers.get('Content-Type');
                    // if(type !== 'application/json'){
                    //   throw new TypeError(`Expected JSON, got ${type}`);
                    // }
  
                    return response.json();
                }
                else {
                    throw new Error(response.statusText);
                }
                })
            .catch((error) => {
                throw error;
            });
}

// exports.addNewTask = async (task) => {
//     return fetch('api/tasks/new', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify() })
//     .catch(function (error) {
//           console.log('Failed to store data on server: ', error);
//         });
// }

export default getAllTasks;
