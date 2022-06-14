let taxscourses = [];
function changetaxcheckbox(ch) {
    let cname = $(ch).data('name');
    let cdept = $(ch).data('dept');
    let cid = $(ch).attr('id');
    let ctax = $(ch).data('tax');
    if(ch.checked) {
        // add
        let fnd = false;
        for(let i in taxscourses) {
            if(taxscourses[i].id == cid) {
                fnd = true;
                break;
            }
        }

        if (!fnd) {
            taxscourses.push({
                id: cid,
                name: cname,
                dept: cdept,
                tax: ctax
            });
        }
    } else {
        // remove
        let newtaxcourses = [];
        for(let i in taxscourses) {
            if(taxscourses[i].id != cid) {
                newtaxcourses.push(taxscourses[i]);
            }
        }

        taxscourses = newtaxcourses;
    }

    redrawtaxcourses();
}

function redrawtaxcourses() {
    if (taxscourses.length > 0) {
        tax_order_amount = 0;
        let od = [];
        for(let i in taxscourses) {
            tax_order_amount += taxscourses[i]['tax'];
            if (typeof(od["_" + taxscourses[i]['dept']]) == 'undefined') {
                od["_" + taxscourses[i]['dept']] = {
                    c: 0,
                    s: 0
                };
            }
            od["_" + taxscourses[i]['dept']]['c']++;
            od["_" + taxscourses[i]['dept']]['s'] += taxscourses[i]['tax'];
        }

        tax_order_description = 'Taxa P3 ';
        for(let i in od) {
            tax_order_description += 'D' + i.replace('_', '') + ':' + od[i]['s'] + ' ';
        }

        document.querySelector('#taxscourses_button').value = 'Plătește ' + tax_order_amount + ' lei';

        $('#taxscourses-wrapper').show();
    } else {
        $('#taxscourses-wrapper').hide();
    }
}

function changecredite() {
    let tot = 0;

    let sum1 = 0;
    let sum2 = 0;
    $(".match").each(function () {
        let ch = $(this);
        let checked = ch.prop("checked");
        let cre = ch.data("credite");

        if (checked) {
            tot += parseInt(cre);

            let sum = parseFloat(ch.data("sum"));
            let sem = parseInt(ch.data("sem"));

            if (sem % 2 == 1) {
                sum1 += sum;
            } else {
                sum2 += sum;
            }
        }

    });

    $("#nrtotcredite").html(tot);
    $("#sumsem1").html(sum1);
    $("#sumsem2").html(sum2);
    $("#sumsemt").html(sum1 + sum2);
}

let nrcredite = 0;
function savematerii() {
    let chs = [];
    let tot = 0;
    let hasnotdisabled = false;

    $(".match").each(function () {
        let ch = $(this);
        let checked = ch.prop("checked");
        let dnd = ch.data("id");
        let cre = ch.data("credite");

        if (ch.prop("disabled") == "") {
            hasnotdisabled = true;
        }

        if (checked) {
            tot += parseInt(cre);
        }

        chs.push({
            dnd: dnd,
            checked: (checked ? 1 : 0),
            cre: cre
        });
    });

    if (nrcredite > 70 && tot < 70) {
        alert('Vă rugăm să selectați materii până când ajungeți la mai mult de 70 credite');
        return;
    }

    if (!confirm('Atenție! Datele dumneavoastră vor fi trimite spre validare și nu veți mai putea modifica. Doriți să continuați?')) {
        return;
    }

    $.post('server/materii-do.php', {chs: JSON.stringify(chs)}, function (data) {
        if(data.ok) {
            document.location.reload(true);
        }
    }, 'json');
}