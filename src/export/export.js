let export_form = document.getElementById("export_form").innerHTML;

function more(){
    Swal.fire({
        title: "Export...",
        html: export_form,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "export",
        preConfirm: () => {
            const game_name = document.getElementById("game_name").value;
            const correo = document.getElementById("correo").value;
            
            if (!nombre || !correo) {
                Swal.showValidationMessage("All inputs are Necessary!");
                return false;
            }
            return { nombre, correo };
        }
        }).then((result) => {
        if (result.isConfirmed) {}
    });
}