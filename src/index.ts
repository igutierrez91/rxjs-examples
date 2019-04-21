import {
  switchMap,
  map,
  filter,
  reduce,
  merge,
  delay,
  concat,
  debounceTime,
  pluck,
  mergeMap,
  flatMap,
  mergeAll,
  concatMap
} from "rxjs/internal/operators";
import { interval, Observable, of, from, fromEvent, forkJoin } from "rxjs";
import { async } from "rxjs/internal/scheduler/async";

document.querySelector("#start").addEventListener("click", fromExample);
document.querySelector("#soloImpares").addEventListener("click", soloImpares);
document
  .querySelector("#sumatorioImpares")
  .addEventListener("click", sumatorioImpares);
document.querySelector("#mergeExample").addEventListener("click", mergeExample);
document
  .querySelector("#concatExample")
  .addEventListener("click", concatExample);

document
  .querySelector("#forkJoinExample")
  .addEventListener("click", forkJoinExample);
document
  .querySelector("#concatMapExample")
  .addEventListener("click", concatMapExample);
document
  .querySelector("#mergeMapExample")
  .addEventListener("click", mergeMapExample);

buscador();

function logItem(val: any) {
  var node = document.createElement("li");
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById("list").appendChild(node);
}

function emptyLog() {
  var list = (document.getElementById("list").innerHTML = "");
  var list = (document.getElementById("listMovies").innerHTML = "");
}

function printError(error: string) {
  var list = (document.getElementById("error").textContent = error);
}

function emptyError() {
  var list = (document.getElementById("error").innerHTML = "");
}

function fromExample() {
  emptyLog();
  var observable$ = from([1, 2, 3, 4, 5]);
  observable$.pipe(map(el => el * 3)).subscribe(element => {
    logItem(element);
  });
}

function soloImpares() {
  emptyLog();
  var observable$ = from([1, 2, 3, 4, 5]);
  observable$
    .pipe(
      map(el => el * 3),
      filter(el => el % 2 !== 0)
    )
    .subscribe(element => {
      logItem(element);
    });
}

function sumatorioImpares() {
  emptyLog();
  var observable$ = from([1, 2, 3, 4, 5]);
  observable$
    .pipe(
      map(el => el * 3),
      filter(el => el % 2 !== 0),
      reduce((a, b) => a + b)
    )
    .subscribe(element => {
      logItem(element);
    });
}

function mergeExample() {
  emptyLog();
  var firstObservable = from([1, 2, 3]).pipe(delay(2000));
  var secondObservable = from([4, 5, 6, 7, 8]).pipe(delay(1000));
  var result = firstObservable
    .pipe(merge(secondObservable))
    .subscribe(element => {
      logItem(element);
    });
}

function concatExample() {
  emptyLog();
  var firstObservable = from([1, 2, 3]).pipe(delay(2000));
  var secondObservable = from([4, 5, 6, 7, 8]).pipe(delay(5000));
  var result = firstObservable
    .pipe(concat(secondObservable))
    .subscribe(element => {
      logItem(element);
    });
}

// Ejemplo con flatMapzº
function buscador() {
  const input = document.querySelector("#buscador");
  const source$ = fromEvent(input, "keyup").pipe(
    map((el: any) => el.target.value),
    filter(el => el.length > 3),
    debounceTime(300),
    flatMap(el =>
      from(dohttpCall(el)).pipe(
        map((data: any) => data.results.map((movie: any) => movie.title))
      )
    )
  );
  source$.subscribe((el: any) => {
    emptyLog();
    el.map((t: string) => pintarTitulos(t));
  });
}

function forkJoinExample() {
  forkJoin([
    detailMovie("456740"),
    detailMovie("456744"),
    detailMovie("456749"),
    detailMovie("456748")
  ]).subscribe(movie => {
    console.log(movie);
  });
}

function concatMapExample() {
  const ids = ["456740", "456744", "456749", "456748"];
  from(ids)
    .pipe(concatMap(id => detailMovie(id)))
    .subscribe(movie => {
      console.log(movie);
    });
}

function mergeMapExample() {
  const ids = ["456740", "456744", "456749", "456748"];
  from(ids)
    .pipe(mergeMap(id => detailMovie(id)))
    .subscribe(movie => {
      console.log(movie);
    });
}
function pintarTitulos(titulo: string) {
  var node = document.createElement("li");
  var textnode = document.createTextNode(titulo);
  node.appendChild(textnode);
  document.getElementById("listMovies").appendChild(node);
}

function dohttpCall(query: string): Promise<any> {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=4c5cbd6e2c2574f904d23e1d057a1d9a&language=es-ES&query=${query}=&page=1&include_adult=true`;
  const params = {
    method: "GET"
  };
  return fetch(url, params).then(data => {
    return data.json();
  });
}

function detailMovie(id: string): Promise<any> {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=4c5cbd6e2c2574f904d23e1d057a1d9a&language=en-US`;
  const params = {
    method: "GET"
  };
  return fetch(url, params).then(data => {
    return data.json();
  });
}
