{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_18

    # keep this line if you use bash
    pkgs.bashInteractive
  ];
}
