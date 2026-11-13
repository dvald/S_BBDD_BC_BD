#!/usr/bin/env python3
"""Revisa un contrato didáctico JSON. No despliega ni conecta con un clúster."""
import argparse
import json
from pathlib import Path


def comprobar(p):
    if not isinstance(p, dict):
        raise ValueError('Se espera un objeto de plan.')
    condiciones = [
        ('replicas', 'Tres miembros previstos', lambda v: type(v) is int and v >= 3),
        ('validacion_estricta', 'API acepta un código de texto, no un objeto de operadores', lambda v: v is True),
        ('puerto_publico', 'Motor sin publicación directa a Internet', lambda v: v is False),
        ('autenticacion', 'Clientes y miembros autenticados', lambda v: v is True),
        ('tls_clientes', 'Canal de cliente protegido', lambda v: v is True),
        ('tls_miembros', 'Canal entre miembros protegido', lambda v: v is True),
        ('secretos', 'Secretos referenciados fuera del manifiesto', lambda v: v == 'referencia_externa'),
        ('red_restringida', 'Solo flujos de red necesarios', lambda v: v is True),
        ('imagen_fijada', 'Versión de imagen fijada', lambda v: v is True),
        ('copia_aislada', 'Copia fuera del alcance del mismo borrado', lambda v: v is True),
    ]
    out = [{'campo': k, 'texto': t, 'ok': f(p.get(k))} for k, t, f in condiciones]
    admitidos = {'nombre'} | {c[0] for c in condiciones}
    out += [{'campo': k, 'texto': 'Campo fuera del contrato: '+k, 'ok': False} for k in p if k not in admitidos]
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('plan', type=Path)
    args = parser.parse_args()
    try:
        checks = comprobar(json.loads(args.plan.read_text(encoding='utf-8')))
    except (OSError, ValueError) as exc:
        parser.exit(2, str(exc)+'\n')
    print(json.dumps({'alcance': 'Revisión de un contrato, no despliegue ni prueba de infraestructura',
                      'comprobaciones': checks}, ensure_ascii=False, indent=2))
    parser.exit(1 if any(not x['ok'] for x in checks) else 0)


if __name__ == '__main__':
    main()
