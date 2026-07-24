let export_form = document.getElementById("export_form").innerHTML;

function export(){
    Swal.fire({
        title: "Export...",
        html: export_form,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "export",
        preConfirm: () => {

            let export_type = document.getElementById("export_type");

            return { export_type };
        }
        }).then((result) => {
        if (result.isConfirmed) {
            if(result.export_type == "html"){
                exportarHTML();
            }
        }
    });
}