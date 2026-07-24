let more_form = document.getElementById("more_form").innerHTML;

function more(){
    Swal.fire({
        title: "More...",
        html: more_form,
        focusConfirm: false,
        showCancelButton: false,
        confirmButtonText: "ok",
        preConfirm: () => {}
        }).then((result) => {
        if (result.isConfirmed) {}
    });
}