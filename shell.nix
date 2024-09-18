{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20

    # keep this line if you use bash
    pkgs.bashInteractive
  ];
}
