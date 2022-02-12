import argparse
import random


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('A', metavar='A', type=int, nargs='?',
                        default=100, help='the number of A entities (default %(default)s)')
    parser.add_argument('B', metavar='B', type=int, nargs='?',
                        default=10, help='the number of B entities in each A (default %(default)s)')
    parser.add_argument('-f', metavar='file', dest='file', type=str, nargs='?',
                        default='init-generator.sql', help='the destination file of the script (default %(default)s)')
    return parser.parse_args()


def generate_sql_file(A: int, B: int) -> str:
    """
    A table -> (id)
    B table -> (id, key: '1'|'2'|'3', value: number, aid)
    """
    s = ""
    for a in range(A):
        s += f"INSERT INTO A VALUES ({a});\n"
        for b in range(B):
            s += f"INSERT INTO B VALUES ({b+(a*B)}, '{random.randint(1, 3)}', {random.randint(0, 100)}, {a});\n"
    return s


def main():
    args = parse_args()
    s = generate_sql_file(args.A, args.B)
    with open(args.file, 'w+') as f:
        f.write(s)
        f.close()


if __name__ == '__main__':
    random.seed(None)
    main()
