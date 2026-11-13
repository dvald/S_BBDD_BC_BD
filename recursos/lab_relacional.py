#!/usr/bin/env python3
"""Laboratorio local y desechable de CosechaDirecta. Python 3.9+, sin paquetes.

Ejecuta SQL en SQLite, una comprobación de autorización en la aplicación y
copia/restauración local. No implementa roles PostgreSQL, TDE ni PITR.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import time


def filas(con):
    return con.execute('SELECT id, cliente, total FROM pedidos ORDER BY id').fetchall()


def huella(datos):
    return hashlib.sha256(json.dumps(datos, ensure_ascii=False).encode()).hexdigest()


def ejecutar():
    con = sqlite3.connect(':memory:')
    con.execute('CREATE TABLE productos(codigo TEXT PRIMARY KEY)')
    con.executemany('INSERT INTO productos VALUES (?)', [('P01',), ('P02',), ('P03',)])
    consultas = []
    for entrada in ['P01', 'P99', "' OR 1=1 -- "]:
        q = "SELECT codigo FROM productos WHERE codigo = '" + entrada + "'"
        consultas.append({
            'entrada': entrada, 'sql_concatenada': q,
            'antes': [x[0] for x in con.execute(q)],
            'despues': [x[0] for x in con.execute('SELECT codigo FROM productos WHERE codigo = ?', (entrada,))],
        })
    con.execute('CREATE TABLE pedidos(id TEXT PRIMARY KEY, cliente TEXT, total INTEGER)')
    con.executemany('INSERT INTO pedidos VALUES (?, ?, ?)', [('C01', 'U17', 40), ('C02', 'U24', 70)])
    autorizacion = []
    for pedido in ['C01', 'C02']:
        # Un parámetro evita SQLi; la condición cliente=? autoriza el alcance.
        obtenidas = con.execute('SELECT id FROM pedidos WHERE id=? AND cliente=?', (pedido, 'U17')).fetchall()
        autorizacion.append({'sesion': 'U17', 'pedido': pedido, 'permitido': bool(obtenidas)})
    con.commit()
    esperado = filas(con)
    with tempfile.TemporaryDirectory(prefix='cosechadirecta-lab-') as folder:
        copia = sqlite3.connect(str(Path(folder) / 'copia.sqlite'))
        inicio = time.perf_counter()
        con.backup(copia)
        copia_ms = (time.perf_counter() - inicio) * 1000
        con.execute('DELETE FROM pedidos')
        con.commit()
        tras_borrado = len(filas(con))
        recuperada = sqlite3.connect(':memory:')
        inicio = time.perf_counter()
        copia.backup(recuperada)
        obtenido = filas(recuperada)
        integra = recuperada.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
        restauracion_ms = (time.perf_counter() - inicio) * 1000
        restauracion = {
            'filas_antes': len(esperado), 'filas_tras_borrado': tras_borrado,
            'filas_recuperadas': len(obtenido), 'integridad_ok': integra,
            'hash_esperado': huella(esperado), 'hash_recuperado': huella(obtenido),
            'coincide': esperado == obtenido and integra,
            'copia_ms': round(copia_ms, 3),
            'restauracion_y_validacion_ms': round(restauracion_ms, 3),
            'rpo_operativo_min': None, 'rto_servicio_min': None,
            'alcance_medida': 'Restauración de una copia SQLite y validación local; no RTO de un servicio ni recuperación PITR.',
        }
        recuperada.close()
        copia.close()
    con.close()
    return {'tipo': 'cosechadirecta-lab-relacional', 'version': 1,
            'motor': 'SQLite ' + sqlite3.sqlite_version, 'consultas': consultas,
            'autorizacion': autorizacion, 'restauracion': restauracion,
            'tde': 'No ejecutado: requiere un motor que lo implemente.',
            'roles_bd': 'No ejecutados: la condición por cliente se prueba en la consulta de la aplicación.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--salida', type=Path, help='Archivo JSON nuevo con la evidencia de esta ejecución')
    args = parser.parse_args()
    if args.salida and args.salida.exists():
        parser.error('La salida ya existe; elige otro nombre para conservar la evidencia anterior.')
    resultado = ejecutar()
    texto = json.dumps(resultado, ensure_ascii=False, indent=2) + '\n'
    if args.salida:
        args.salida.write_text(texto, encoding='utf-8')
    print(texto)


if __name__ == '__main__':
    main()
