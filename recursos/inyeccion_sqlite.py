"""
Clase 2 · Inyección SQL en el buscador de productos de CosechaDirecta (caso ficticio).

Se ejecuta solo en tu equipo: base SQLite en memoria, datos inventados, sin red.
Requisito: Python 3.8 o superior (sqlite3 viene incluido; no hay que instalar nada).

    python3 inyeccion_sqlite.py              las tres entradas en los tres modos
    python3 inyeccion_sqlite.py --pausa      igual, parando tras cada paso (para proyectar)
    python3 inyeccion_sqlite.py --modo vulnerable --entrada "tomate"
    python3 inyeccion_sqlite.py --json       resultados en JSON (los usa la demo de la clase)

En Windows, «py» en lugar de «python3».

Modos:
  vulnerable    el texto del usuario se pega dentro de la sentencia SQL
  parametrizada la sentencia y el dato viajan por separado (marcador ?)
  minimo        la consulta sigue siendo vulnerable, pero la cuenta de la aplicación
                solo puede leer la tabla de productos. SQLite no tiene usuarios: el
                permiso se emula con un autorizador (Connection.set_authorizer). En
                PostgreSQL sería, por ejemplo:  GRANT SELECT ON productos TO app_web;
"""

import argparse
import json
import sqlite3
import sys

PRODUCTOS = [
    ("Tomate rosa", 3.20),
    ("Tomate cherry", 2.90),
    ("Aceite de oliva virgen extra", 9.50),
    ("Queso curado de oveja", 14.00),
    ("Miel de romero", 6.80),
]
CLIENTES = [  # los mismos clientes ficticios que clientes_ficticios.csv
    ("ana@ejemplo.test", "Ana"),
    ("luis@ejemplo.test", "Luis"),
    ("marta@ejemplo.test", "Marta"),
]
ENTRADAS = [
    ("A", "tomate", "búsqueda normal"),
    ("B", "x' OR 1=1 --", "la condición se cumple siempre"),
    ("C", "x' UNION SELECT email, nombre FROM clientes --", "añade filas de otra tabla"),
]
MODOS = {
    "vulnerable": "concatena el texto en la SQL",
    "parametrizada": "sentencia y dato por separado",
    "minimo": "concatena, pero la cuenta solo lee productos",
}
SQL_VULNERABLE = "SELECT nombre, precio FROM productos WHERE nombre LIKE '%{texto}%'"
SQL_PARAMETRIZADA = "SELECT nombre, precio FROM productos WHERE nombre LIKE ?"


def preparar():
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, precio REAL)")
    con.execute("CREATE TABLE clientes (id INTEGER PRIMARY KEY, email TEXT, nombre TEXT)")
    con.executemany("INSERT INTO productos (nombre, precio) VALUES (?, ?)", PRODUCTOS)
    con.executemany("INSERT INTO clientes (email, nombre) VALUES (?, ?)", CLIENTES)
    return con


SQLITE_FUNCTION = getattr(sqlite3, "SQLITE_FUNCTION", 31)   # llamada a funciones como LIKE


def solo_productos(accion, arg1, arg2, base, origen):
    """Autorizador: permite SELECT, funciones y la lectura de la tabla productos; deniega lo demás."""
    if accion in (sqlite3.SQLITE_SELECT, SQLITE_FUNCTION):
        return sqlite3.SQLITE_OK
    if accion == sqlite3.SQLITE_READ and arg1 == "productos":
        return sqlite3.SQLITE_OK
    return sqlite3.SQLITE_DENY


def buscar(texto, modo):
    """Devuelve un diccionario con la SQL enviada, el parámetro (si lo hay), las filas o el error."""
    con = preparar()
    if modo == "parametrizada":
        sql, parametro = SQL_PARAMETRIZADA, "%" + texto + "%"
    else:
        sql, parametro = SQL_VULNERABLE.format(texto=texto), None
    if modo == "minimo":
        con.set_authorizer(solo_productos)
    try:
        filas = con.execute(sql, (parametro,)).fetchall() if parametro is not None else con.execute(sql).fetchall()
        return {"modo": modo, "entrada": texto, "sql": sql, "parametro": parametro,
                "filas": [list(f) for f in filas], "error": None}
    except sqlite3.DatabaseError as exc:
        return {"modo": modo, "entrada": texto, "sql": sql, "parametro": parametro,
                "filas": [], "error": f"{type(exc).__name__}: {exc}"}


def formato(valor):
    return f"{valor:.2f}" if isinstance(valor, float) else str(valor)


def imprimir(r):
    print(f"  SQL enviada:  {r['sql']}")
    if r["parametro"] is not None:
        print(f"  Parámetro:    {r['parametro']!r}  (se compara como texto; nunca se ejecuta)")
    if r["error"]:
        print(f"  ERROR         {r['error']}")
    else:
        print(f"  Resultado:    {len(r['filas'])} fila(s)")
        for fila in r["filas"]:
            print("                " + " | ".join(formato(v) for v in fila))
    print()


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--modo", choices=list(MODOS), help="un solo modo (por defecto, los tres)")
    ap.add_argument("--entrada", help="texto propio para el buscador (por defecto, las entradas A, B y C)")
    ap.add_argument("--pausa", action="store_true", help="esperar a Intro tras cada paso")
    ap.add_argument("--json", action="store_true", help="salida en JSON")
    a = ap.parse_args()
    modos = [a.modo] if a.modo else list(MODOS)
    entradas = [("propia", a.entrada, "entrada propia")] if a.entrada is not None else ENTRADAS
    if a.json:
        out = [dict(buscar(texto, modo), id=eid) for modo in modos for eid, texto, _ in entradas]
        json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
        print()
        return
    print("Buscador de productos de CosechaDirecta (datos ficticios, SQLite en memoria)")
    print(f"Python {sys.version.split()[0]} · SQLite {sqlite3.sqlite_version}\n")
    for modo in modos:
        print(f"=== Modo {modo}: {MODOS[modo]} ===\n")
        for eid, texto, desc in entradas:
            print(f"[{eid}] Entrada: {texto}   ({desc})")
            imprimir(buscar(texto, modo))
            if a.pausa:
                input("    (Intro para continuar) ")
                print()


if __name__ == "__main__":
    main()
