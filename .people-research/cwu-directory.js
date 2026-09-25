(function () {
  const currentScript = document.currentScript;

  const rawDept = currentScript.getAttribute('dept');
  const rawCollege = currentScript.getAttribute('college');
  const rawPos = currentScript.getAttribute('pos');
  const rawLoc = currentScript.getAttribute('loc');
  const rawCar = currentScript.getAttribute('car');

  const dept = (rawDept === "None" || rawDept == null) ? "" : rawDept.replace(/,/g, "");
  const college = (rawCollege === "None" || rawCollege == null) ? "" : rawCollege;
  const pos = (rawPos === "None" || rawPos == null) ? "" : rawPos;
  const loc = (rawLoc === "None" || rawLoc == null) ? "" : rawLoc;
  const car = (rawCar === "None" || rawCar == null) ? "" : rawCar;

  let apiUrl = "";

  // Find the results container by traversing up to the .aggregate__set sibling,
  // then selecting the inner grid div. This removes the need for unique IDs and
  // allows unlimited instances on the same page.
  const aggregateSet = currentScript.previousElementSibling;
  if (!aggregateSet) {
    console.warn('Directory component: could not find adjacent .aggregate__set container.');
    return;
  }
  const resultsContainer = aggregateSet.querySelector('.aggregate__results');
  if (!resultsContainer) {
    console.warn('Directory component: could not find .aggregate__results inside container.');
    return;
  }

  console.log(dept);

  if (car === "carousel") {
    apiUrl = `https://www.cwu.edu/_common/files/php/views/faculty/results.php/?search=&type=&colleges=&locations=&deptprog=${dept}&pageindex=0&pagesize=100`;
  } else {
    if (pos.includes("Faculty")) {
      apiUrl = `https://www.cwu.edu/_common/files/php/views/faculty/results.php/?search=&type=${pos}&colleges=${college}&locations=${loc}&deptprog=${dept}&pageindex=0&pagesize=100`;
    } else if (pos === "Staff") {
      apiUrl = `https://www.cwu.edu/_common/files/php/views/faculty/results.php/?search=&type=${pos}&colleges=${college}&locations=${loc}&deptprog=${dept}&pageindex=0&pagesize=100`;
    } else {
      apiUrl = `https://www.cwu.edu/_common/files/php/views/faculty/results.php/?search=&type=&colleges=${college}&locations=${loc}&deptprog=${dept}&pageindex=0&pagesize=100`;
    }
  }
  console.log(apiUrl);
  fetch(encodeURI(apiUrl))
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      data.forEach(el => {
        const html = el.Results;
        resultsContainer.innerHTML += html;
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
})();
