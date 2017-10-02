var natures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'];

function PreviewAdvance(seed, amount)
{
    var nseed = seed;

    for (var i = 0; i < amount; i++)
        nseed = ((nseed * 0x000343fd) + 0x00269ec3) & 0xFFFFFFFF;

    return NS(nseed);
}

function NS(seed)
{
    if (seed < 0)
        seed += 0x100000000;

    return seed;
}

function NS2(no)
{
    if (no < 0)
        no += 32;

    return no;
}

function GetPID(seed)
{
    upper = PreviewAdvance(seed, 3) >> 16;
    lower = PreviewAdvance(seed, 4) >> 16;

    if (upper < 0)
        upper += 0x10000;

    if (lower < 0)
        lower += 0x10000;

    upper = ("0000" + upper.toString(16));
    upper = upper.substring(upper.length - 4, upper.length);
    lower = ("0000" + lower.toString(16));
    lower = lower.substring(lower.length - 4, lower.length);

    return (upper + lower);
}

function GetAbility(seed)
{
    return (PreviewAdvance(seed, 1) >> 31) + 1;
}

function GetIVString(seed)
{
    IVs = "";
    var x = PreviewAdvance(seed, 1);

    IVs += NS2((x >> 16) % 32) + "/";
    IVs += NS2((x >> 21) % 32) + "/";
    IVs += NS2((x >> 26) % 32) + "/";

    x = PreviewAdvance(seed, 2);

    IVs += NS2((x >> 21) % 32) + "/";
    IVs += NS2((x >> 26) % 32) + "/";
    IVs += NS2((x >> 16) % 32) + "";

    return IVs;
}

var GetPIDsFromIVs = function (textbox)
{
    var html = "<tr><th>Seed</th><th>PID</th><th>Nature</th><th>Ability</th></tr>";
    var seed;

    var ivs = textbox.val().split('/');
    var ivs1 = ((parseInt(ivs[2]) << 10) + (parseInt(ivs[1]) << 5) + parseInt(ivs[0]));
    var ivs2 = ((parseInt(ivs[4]) << 10) + (parseInt(ivs[3]) << 5) + parseInt(ivs[5]));

    for (var i = 0; i < 2; i++)
    {
        ivs1 += (i << 15);

        for (var j = 0; j < 65536; j++)
        {
            seed = NS(ivs1 << 16) + j;

            if (((PreviewAdvance(seed, 1) >> 16) & 0x7FFF) == ivs2)
            {
                //Seed
                seedstr = "00000000" + seed.toString(16);
                seedstr = seedstr.substring(seedstr.length - 8, seedstr.length);

                pid = GetPID(seed);
                n = NS(parseInt(pid, 16)) % 25;

                html += "<tr><td>" + seedstr + "</td><td>" + pid + "</td><td>" + natures[n] + "</td><td>" + GetAbility(seed) + "</td></tr>";

                if (seed < 0)
                    a = 1;
            }
        }
    }

    return html;
}

// Document ready for a exemple

$( document ).ready(function() {
    $( "#search" ).click(function() {
      $("#results").html(GetPIDsFromIVs($("#textIVs")));
    });
    $( "#search" ).trigger( "click" );
});