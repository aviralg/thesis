

// remove abstract from table of contents
$("#toc > ul:first-child > li:first-child").remove();
$("#toc > ul").append(
    $("<li><a href='#references'>References</a></li>")
)

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

$("pre code").first().text(
"#' This function wraps base::if\
\n#' @strict cond\
\nmy_if <- function(cond, yes, no) {\
\n    if(cond) yes else no\
\n}"
);

$("pre code").last().text(
"my_if <- function(cond: strict, yes, no) {\
\n    if(cond) yes else no\
\n}"
);

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
        <div class="card-header text-bg-dark">
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


function citationAuthors(citation) {
    var authors = citation.author.map(name => name.given + ' ' + name.family);
    authors = authors.join(', ');
    return authors;
}

function citationId(citation) {
    return citation.id;
}

EXCLUDE_SET = {
    "in": true,
    "we": true,
    "with": true,
    "the": true,
    "of": true,
    "and": true,
    "for": true,
    "to": true,
    "on": true,
    "is": true
};

function toUpperCase(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function citationTitle(citation) {
    var title = citation.title;
    var words = title.split(" ");
    words = words.map(
        function(word) {
            if (word in EXCLUDE_SET) {
                return word;
            }
            else {
                return toUpperCase(word);
            }
        }
    );

    return words.join(" ");
}

function citationDate(citation) {
    return citation.issued["date-parts"][0][0];
}


function citationPublisher(citation) {

    var publisher = citation.publisher;

    if(publisher === undefined) {
        return "";
    }
    else {
        return publisher;
    }
}

function citationConference(citation) {

    var conference = citation["container-title"];

    if(conference === undefined) {
        return "";
    }
    else {
        return conference;
    }
}

function citationVolume(citation) {

    var volume = citation["volume"];

    if(volume === undefined) {
        return "";
    }
    else {
        return volume;
    }
}

function citationIssue(citation) {

    var issue = citation["issue"];

    if(issue === undefined) {
        return "";
    }
    else {
        return issue;
    }
}


function citationIsbn(citation) {
    var isbn = citation.ISBN;

    if(isbn === undefined) {
        return "";
    }
    else {
        return isbn;
    }
}


function citationDoi(citation) {
    var doi = citation.DOI;

    if(doi === undefined) {
        return "";
    }
    else {
        return doi;
    }
}

function bookCitation(citation) {
    var id = citationId(citation);
    var title = citationTitle(citation);

    var isbn = citationIsbn(citation);
    var date = citationDate(citation);
    var authors = citationAuthors(citation);
    var publisher = citationPublisher(citation);

    var html = `<li id="ref-${id}" class="list-group-item d-flex justify-content-between align-items-start">
                     <div class="ms-2 me-auto">
                         <div class="fw-bold">${title}</div>
                         <div class="fst-italic">${publisher}, ${date}</div>
                         <div class="fw-lighter">${authors}</div>
                     </div>
                     <span class="badge font-monospace fw-normal bg-danger bg-opacity-10" style="color: #930000;">ISBN: ${isbn}</span>
                </li>`;

    return $(html);
}

function conferenceCitation(citation) {
    var id = citationId(citation);
    var title = citationTitle(citation);

    var doi = citationDoi(citation);
    var date = citationDate(citation);
    var authors = citationAuthors(citation);
    var conference = citationConference(citation);

    var html = `<li id="ref-${id}" class="list-group-item d-flex justify-content-between align-items-start">
                     <div class="ms-2 me-auto">
                         <div class="fw-bold">${title}</div>
                         <div class="fst-italic">${conference}, ${date}</div>
                         <div class="fw-lighter">${authors}</div>
                     </div>
                     <span class="badge font-monospace fw-normal bg-danger bg-opacity-10" style="color: #930000;">DOI: ${doi}</span>
                </li>`;

    return $(html);
}

function journalCitation(citation) {
    var id = citationId(citation);
    var title = citationTitle(citation);

    var doi = citationDoi(citation);
    var date = citationDate(citation);
    var authors = citationAuthors(citation);
    var conference = citationConference(citation);

    var volume = citationVolume(citation);
    if(volume !== "") volume = ' ' + volume;

    var issue = citationIssue(citation);
    if(issue !== "") issue = '.' + issue;

    var html = `<li id="ref-${id}" class="list-group-item d-flex justify-content-between align-items-start">
                     <div class="ms-2 me-auto">
                         <div class="fw-bold">${title}</div>
                         <div class="fst-italic">${conference}${volume}${issue}, ${date}</div>
                         <div class="fw-lighter">${authors}</div>
                     </div>
                     <span class="badge font-monospace fw-normal bg-danger bg-opacity-10">
                         <a href="https://www.doi.org/${doi}">DOI: ${doi}</a>
                     </span>
                </li>`;

    return $(html);
}

$.getJSON("js/bibliography.json", function(bibliography) {

    var citations = bibliography.map(function(citation) {

        var type = citation.type;

        if(type === "book") {
            return bookCitation(citation);
        }
        else if (type === "paper-conference" || type === "chapter") {
            return conferenceCitation(citation);
        }
        else if (type === "article-journal") {
            return journalCitation(citation);
        }
        else {
            var id = citation.id;
            var doi = citation.doi;
            var year = citationDate(citation);
            var title = citationTitle(citation);
            var conf = citation["container-title"] || ""
            conf = addWithSeparator(conf, citation["volume"] || "", " ");
            conf = addWithSeparator(conf, citation["issue"] || "", ", ");

            var authors = citationAuthors(citation);

            var citation = `<li id="ref-${id}" class="list-group-item d-flex justify-content-between align-items-start">
                            <div class="ms-2 me-auto">
                                <div class="fw-bold">${title}</div>
                                <div class="fw-bold">${conf}</div>
                                ${authors}
                            </div>
                            <span class="badge bg-primary rounded-pill">${year}</span>
                       </li>`;

            return $(citation);
        }
    });

    console.log(citations);

    $("#ref-list").empty();
    $("#ref-list").append(citations);
});


var inparadesc = $(".inparadesc");
var inparaprev = inparadesc.prev();
var inparanext = inparadesc.next();

var points = inparadesc.children("p").map(function() { return $(this).text(); }).toArray().join(' ');

inparaprev.text(
    inparaprev.text() + ' ' + points + "."
);

inparadesc.remove();

inparanext.text(
    inparanext.text().slice(1)
);
