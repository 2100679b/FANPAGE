#!/usr/bin/env python3
"""
Verificador de colores para ruleta europea
Este script verifica que los colores estén correctamente asignados según las reglas oficiales
"""

# Números en orden físico de la ruleta europea
numeros_ruleta = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
]

# Números rojos oficiales en la ruleta europea
numeros_rojos = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

def asignar_color(numero):
    """Asigna el color correcto según las reglas oficiales"""
    if numero == 0:
        return 'verde'
    elif numero in numeros_rojos:
        return 'rojo'
    else:
        return 'negro'

def verificar_colores():
    """Verifica y muestra la asignación de colores"""
    print("🎰 VERIFICACIÓN DE COLORES - RULETA EUROPEA")
    print("=" * 50)
    
    colores = {}
    
    # Asignar colores
    for num in numeros_ruleta:
        colores[num] = asignar_color(num)
    
    # Mostrar por colores
    verdes = [num for num, color in colores.items() if color == 'verde']
    rojos = [num for num, color in colores.items() if color == 'rojo']
    negros = [num for num, color in colores.items() if color == 'negro']
    
    print(f"🟢 VERDES: {verdes}")
    print(f"🔴 ROJOS: {sorted(rojos)}")
    print(f"⚫ NEGROS: {sorted(negros)}")
    
    print(f"\nTotal números: {len(numeros_ruleta)}")
    print(f"Verdes: {len(verdes)}, Rojos: {len(rojos)}, Negros: {len(negros)}")
    
    # Verificar algunos números específicos
    print("\n🔍 VERIFICACIONES ESPECÍFICAS:")
    numeros_test = [0, 4, 19, 26, 32]
    for num in numeros_test:
        color = colores[num]
        print(f"Número {num}: {color.upper()}")
    
    # Generar código JavaScript
    print("\n💻 CÓDIGO JAVASCRIPT GENERADO:")
    print("const colores = {")
    for i, num in enumerate(numeros_ruleta):
        color = colores[num]
        coma = "," if i < len(numeros_ruleta) - 1 else ""
        print(f"  {num}: '{color}'{coma}")
    print("};")
    
    return colores

def simular_apuestas(num_simulaciones=100):
    """Simula apuestas para verificar el funcionamiento"""
    import random
    
    print(f"\n🎲 SIMULACIÓN DE {num_simulaciones} APUESTAS")
    print("=" * 50)
    
    colores = {num: asignar_color(num) for num in numeros_ruleta}
    
    resultados = {'rojo': 0, 'negro': 0, 'verde': 0}
    
    for i in range(num_simulaciones):
        numero_ganador = random.choice(numeros_ruleta)
        color_ganador = colores[numero_ganador]
        resultados[color_ganador] += 1
        
        if i < 10:  # Mostrar primeras 10
            print(f"Giro {i+1}: {numero_ganador} ({color_ganador.upper()})")
    
    print("\n📊 RESULTADOS:")
    for color, count in resultados.items():
        porcentaje = (count / num_simulaciones) * 100
        print(f"{color.upper()}: {count} veces ({porcentaje:.1f}%)")
    
    # Probabilidades teóricas
    print("\n📈 PROBABILIDADES TEÓRICAS:")
    print("ROJO: 48.6% (18/37)")
    print("NEGRO: 48.6% (18/37)")
    print("VERDE: 2.7% (1/37)")

if __name__ == "__main__":
    colores = verificar_colores()
    simular_apuestas(1000)