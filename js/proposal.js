

// remove abstract from table of contents
$("#toc > ul:first-child > li:first-child").remove();

// move abstract before table of contents
var abstract = $("#abstract");
var rest = $("#abstract").nextUntil("h1");
$("#abstract-holder").append(abstract.add(rest));


// change refs to a list
// remove [Bibliography] p tag
$("#refs").prev().remove()

$('#refs > div').replaceWith(function(){
    var id = $(this).attr("id");
    return $("<li />").append($(this).contents()).attr("id", id);
});

$('#refs').replaceWith(function(){
    return $("<ul />").append($(this).contents()).attr("id", "ref-list");
});

$("<h1 id='references'>References</h1>").insertBefore($("#ref-list"));



var counters = [0, 0, 0, 0, 0, 0];
$("#main-content").children("div").children("h1, h2, h3, h4").each(function() {
    var tagName = $(this).prop("tagName");
    var index = parseInt(tagName.charAt(tagName.length - 1), 10) - 1;
    var i;

    counters[index] += 1;

    for(let i = index + 1; i < 6; ++i) {
        counters[i] = 0;
    }

    var number = counters[0].toString();

    for(let i = 1; i <= index; ++i) {
        number = number + "." + counters[i].toString();
    }

    var newText = '[' + number + ']' + ' ' + $(this).text();

    $(this).text(newText);
});

$("table").attr("class", "table");


$("#abstract").next().replaceWith(function() {
    var text = $("#abstract").next().children("p").children("span").first().children("em").html();
    console.log(text);
    var refId = $("#abstract").next().children("p").children("span.citation").attr("data-cites");
    var refName = $("#abstract").next().children("p").children("span.citation").text();

    var blockquote = `<figure class="text-end">
        <blockquote class="blockquote">
        <p>${text}</p>
        </blockquote>
        <figcaption class="blockquote-footer">
        <cite data-cites="${refId}" title="${refName}">${refName}</cite>
        </figcaption>
        </figure>`;

    return $(blockquote);
})


$("#main-content").children("div").children("h1").each(function() {
    $(this).attr("class", "chapter");
});

$("#abstract, #contents").each(function() {
    $(this).attr("class", "chapter");
});

$("#main-content").children("div").children("h2").each(function() {
    $(this).attr("class", "section");
});


function numberToc(elt, parentNumber) {

    elt.children("li").each(function(index) {

        var aElt = $(this).children("a").first();

        var currentNumber = (index + 1).toString();
        var number = parentNumber;
        if(parentNumber === "") {
            number = currentNumber;
        }
        else {
            number +=  "." + currentNumber;
        }

        var newText = number + " • " + aElt.text();

        aElt.text(newText);

        numberToc($(this).children("ul"), number);
    });
}

numberToc($("#toc").children().first(), "");



$("span.citation").replaceWith(function() {
    var dataCites = $(this).attr("data-cites");
    var content = $(this).text();

    return $(`<cite data-cites="${dataCites}" title="${content}">${content}</cite>`);
});

$("cite").each(function() {
    var cls = "fw-semibold bg-danger bg-opacity-10 rounded-2";
    $(this).attr("class", cls);

    var content = $(this).text();
    var dataCites = $(this).attr("data-cites");

    $(this).html(`<a href="#ref-${dataCites}">${content}<a>`);

    /*
    var citation = $(`#ref-list #ref-${dataCites}`);

    if(citation.length != 0) {
        var authors = citation.contents().first().text();
        var conf = citation.children("em").text();
        var link = citation.children("a").text();

        var description = `<p>${authors}</p>
                       <p>${conf}</p>
                       <a href="${link}">${link}</a>`;

        $(this).attr("data-bs-toggle", "popover");
        $(this).attr("data-bs-html", "true");
        $(this).attr("data-bs-content", description);
    }
*/
});


/*
$("#ref-list").children().replaceWith(function() {

    var title = $(this).children("span:first-child").first().text().slice(1, -1);
    var link = $(this).children("a:first-child").first().text();
    var authors = $(this).contents().first().text();

    var html = `<li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">${title}
                    </div>
                        ${authors}
                    </div>
                </li>`;

    return $(html);
});

*/

document.addEventListener('DOMContentLoaded', (event) => {
    var elts = $("pre code");
    elts.attr("class", "language-r");

    elts.each(function() {
        hljs.highlightElement(this);
    });
});

var TColorBoxHeadings = ["Thesis Question", "Thesis Proposal", "Thesis Contributions"];

$(".tcolorbox").each(function(index) {
    var html = $(this).html();
    var node = `<div class="card mb-3">
        <div class="card-header">
        ${TColorBoxHeadings[index]}
        </div>
        <div class="card-body">
        ${html}
        </div>
        </div>`;

    $(this).replaceWith($(node));
});

$("dl > dd > p > br").remove();
$("dl > dt").attr("class", "AFS-5");

function addWithSeparator(left, right, sep) {
    if(left === "") {
        return right;
    }
    else {
        return (left + sep + right);
    }
}

$("#ref-list").replaceWith(function() {
    var html = $(this).html();
    var newHtml = `<ol id="ref-list" class="list-group list-group-numbered list-group-flush">${html}</ol>`;
    return $(newHtml);
});

$.getJSON("bibliography.json", function(bibliography) {

    var citations = bibliography.map(function(citation) {

        var id = citation.id;
        var doi = citation.doi;
        var year = citation.issued["date-parts"][0][0];
        var title = citation.title;
        var conf = citation["container-title"] || ""
        conf = addWithSeparator(conf, citation["volume"] || "", " ");
        conf = addWithSeparator(conf, citation["issue"] || "", ", ");

        var authors = citation.author.map(name => name.given + ' ' + name.family);
        authors = authors.join(', ');

        var citation = `<li id="ref-${id}" class="list-group-item d-flex justify-content-between align-items-start">
                            <div class="ms-2 me-auto">
                                <div class="fw-bold">${title}</div>
                                <div class="fw-bold">${conf}</div>
                                ${authors}
                            </div>
                            <span class="badge bg-primary rounded-pill">${year}</span>
                       </li>`;

        return $(citation);
    });

    console.log(citations);

    $("#ref-list").empty();
    $("#ref-list").append(citations);
});

