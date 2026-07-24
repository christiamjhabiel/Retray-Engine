let more = document.getElementById("more_form");

function more(){
    Swal.fire({
        title: "More...",
        html: more,
        focusConfirm: false,
        showCancelButton: false,
        confirmButtonText: "ok",
        preConfirm: () => {}
        }).then((result) => {
        if (result.isConfirmed) {
            continue;
        }
    });
}